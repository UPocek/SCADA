using System;
using Microsoft.AspNetCore.Mvc;
using scada_back.DTOs;
using scada_back.Models;
using scada_back.Services;

namespace scada_back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TagsService _tagService;
        public UserController(UserService userService, TagsService tagsService)
        {
            _userService = userService;
            _tagService = tagsService;
        }

        [HttpPost("registration")]
        public async Task<ActionResult<User>> Registration(UserCredentialsDTO userCredentials)
        {
            try
            {
                return await _userService.SaveUser(userCredentials);
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(UserCredentialsDTO userCredentials)
        {
            User loggedInUser = await _userService.GetUser(userCredentials);
            if (loggedInUser == null)
            {
                return NotFound();
            }
            _tagService.RunUserThreads(loggedInUser);
            return loggedInUser;
        }

        [HttpPut("logout")]
        public async Task Logout(string userId)
        {
            await _userService.DeactivateUser(userId);
        }
    }
}

