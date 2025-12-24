using System.Security.Claims;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessenger.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetMe()
    {
        var userId = GetUserId();
        var profile = await _userService.GetProfileAsync(userId);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserProfileDto>> GetById(Guid id)
    {
        var profile = await _userService.GetProfileByIdAsync(id);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPut("me/profile")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        try
        {
            var userId = GetUserId();
            await _userService.UpdateProfileAsync(userId, request);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("contacts")]
    public async Task<ActionResult<IEnumerable<ContactDto>>> GetContacts()
    {
        var userId = GetUserId();
        var contacts = await _userService.GetContactsAsync(userId);
        return Ok(contacts);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserProfileDto>>> Search([FromQuery] string? search)
    {
        var users = await _userService.GetDirectoryAsync(search);
        return Ok(users);
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
