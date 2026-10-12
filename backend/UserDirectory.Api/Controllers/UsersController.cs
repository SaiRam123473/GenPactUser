using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserDirectory.Api.Data;
using UserDirectory.Api.Models;

namespace UserDirectory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class UsersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<User>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<User>>> GetAll(CancellationToken cancellationToken)
        => Ok(await db.Users.AsNoTracking().OrderBy(user => user.Name).ToListAsync(cancellationToken));

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<User>> GetById(int id, CancellationToken cancellationToken)
    {
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Id == id, cancellationToken);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    [ProducesResponseType(typeof(User), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<User>> Create([FromBody] User user, CancellationToken cancellationToken)
    {
        Normalize(user);
        if (!TryValidateModel(user)) return ValidationProblem(ModelState);
        db.Users.Add(user);
        await db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<User>> Update(int id, [FromBody] User input, CancellationToken cancellationToken)
    {
        var user = await db.Users.FindAsync(new object[] { id }, cancellationToken);
        if (user is null) return NotFound();
        Normalize(input);
        if (!TryValidateModel(input)) return ValidationProblem(ModelState);
        user.Name = input.Name;
        user.Age = input.Age;
        user.City = input.City;
        user.State = input.State;
        user.Pincode = input.Pincode;
        await db.SaveChangesAsync(cancellationToken);
        return Ok(user);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var user = await db.Users.FindAsync(new object[] { id }, cancellationToken);
        if (user is null) return NotFound();
        db.Users.Remove(user);
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static void Normalize(User user)
    {
        user.Name = user.Name?.Trim() ?? string.Empty;
        user.City = user.City?.Trim() ?? string.Empty;
        user.State = user.State?.Trim() ?? string.Empty;
        user.Pincode = user.Pincode?.Trim() ?? string.Empty;
    }
}
