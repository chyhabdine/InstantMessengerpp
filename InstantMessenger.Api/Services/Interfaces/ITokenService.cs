using InstantMessenger.Api.Models;

namespace InstantMessenger.Api.Services.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user, IEnumerable<string> roles);
    string GenerateRefreshToken();
}
