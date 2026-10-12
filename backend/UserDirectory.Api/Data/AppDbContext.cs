using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Models;

namespace UserDirectory.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
}
