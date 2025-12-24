using System.Security.Claims;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessenger.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ChatsController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatsController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost]
    public async Task<ActionResult<ChatDto>> Create(CreateChatRequest request)
    {
        try
        {
            var userId = GetUserId();
            var chat = await _chatService.CreateChatAsync(userId, request);
            return Ok(chat);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ChatDto>>> GetMyChats()
    {
        var userId = GetUserId();
        var chats = await _chatService.GetChatsForUserAsync(userId);
        return Ok(chats);
    }

    [HttpPost("{chatId:guid}/members")]
    public async Task<IActionResult> AddMember(Guid chatId, AddChatMemberRequest request)
    {
        try
        {
            await _chatService.AddMemberAsync(chatId, request);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
