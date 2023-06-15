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
        private UserService _userService;
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<User> Registration(UserCredentialsDTO userCredentials)
        {
            return await _userService.SaveUser(userCredentials);
        }

        [HttpPost]
        public async Task<ActionResult<User>> Login(UserCredentialsDTO userCredentials)
        {
            User loggedInUser = await _userService.GetUser(userCredentials);
            if (loggedInUser == null)
            {
                return NotFound();
            }
            return loggedInUser;
        }
    }
}

