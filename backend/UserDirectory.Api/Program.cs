using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
var allowedOrigins =
    builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure SQLite database path
var configuredPath =
    builder.Configuration["Database:Path"]
    ?? Environment.GetEnvironmentVariable("DB_PATH")
    ?? "data/app.db";

// Resolve relative paths from the API project directory
var fullPath = Path.IsPathRooted(configuredPath)
    ? configuredPath
    : Path.GetFullPath(
        Path.Combine(builder.Environment.ContentRootPath, configuredPath));

// Create the database directory if it doesn't exist
var databaseDirectory = Path.GetDirectoryName(fullPath);

if (!string.IsNullOrWhiteSpace(databaseDirectory))
{
    Directory.CreateDirectory(databaseDirectory);
}

// Register Entity Framework Core
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite($"Data Source={fullPath}");
});

var app = builder.Build();

// Initialize the database
try
{
    using var scope = app.Services.CreateScope();

    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();

    app.Logger.LogInformation(
        "SQLite database initialized at: {DatabasePath}",
        fullPath);
}
catch (Exception ex)
{
    app.Logger.LogCritical(
        ex,
        "Failed to initialize SQLite database at: {DatabasePath}",
        fullPath);

    throw;
}

// Configure middleware
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("Frontend");

app.MapControllers();

// Health check
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy"
}));

app.Run();

public partial class Program { }