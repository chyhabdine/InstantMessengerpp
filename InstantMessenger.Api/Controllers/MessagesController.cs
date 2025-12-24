using System.Security.Claims;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models.Enums;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessenger.Api.Controllers;

[ApiController]
[Authorize]
[Route("api")]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;

    public MessagesController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpPost("chats/{chatId:guid}/messages")]
    public async Task<ActionResult<MessageDto>> Send(Guid chatId, SendMessageRequest request)
    {
        try
        {
            var userId = GetUserId();
            request.ChatId = chatId;
            var message = await _messageService.SendMessageAsync(userId, request);
            return Ok(message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("chats/{chatId:guid}/messages")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> Get(Guid chatId)
    {
        try
        {
            var userId = GetUserId();
            var messages = await _messageService.GetMessagesAsync(chatId, userId);
            return Ok(messages);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("messages/{messageId:guid}/reactions")]
    public async Task<ActionResult<ReactionDto>> React(Guid messageId, [FromQuery] ReactionType type)
    {
        try
        {
            var userId = GetUserId();
            var reaction = await _messageService.ReactAsync(userId, messageId, type);
            return Ok(reaction);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
