using System.Security.Claims;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessenger.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class FriendRequestsController : ControllerBase
{
    private readonly IFriendshipService _friendshipService;

    public FriendRequestsController(IFriendshipService friendshipService)
    {
        _friendshipService = friendshipService;
    }

    [HttpPost]
    public async Task<ActionResult<FriendRequestDto>> Send(CreateFriendRequest request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _friendshipService.SendRequestAsync(userId, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id:guid}/respond")]
    public async Task<ActionResult<FriendRequestDto>> Respond(Guid id, RespondFriendRequest request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _friendshipService.RespondAsync(id, userId, request);
            return result is null ? NotFound() : Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("incoming")]
    public async Task<ActionResult<IEnumerable<FriendRequestDto>>> Incoming()
    {
        var userId = GetUserId();
        var requests = await _friendshipService.GetIncomingAsync(userId);
        return Ok(requests);
    }

    [HttpGet("outgoing")]
    public async Task<ActionResult<IEnumerable<FriendRequestDto>>> Outgoing()
    {
        var userId = GetUserId();
        var requests = await _friendshipService.GetOutgoingAsync(userId);
        return Ok(requests);
    }

    [HttpGet("contacts")]
    public async Task<ActionResult<IEnumerable<ContactDto>>> Friends()
    {
        var userId = GetUserId();
        var friends = await _friendshipService.GetFriendsAsync(userId);
        return Ok(friends);
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
