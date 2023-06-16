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


        [HttpPost("{userId}/addTag/analog")]
        public async Task<ActionResult<AnalogInput>> AddNewAnalogTag(string userId, AnalogTagDTO analogTag)
        {
            AnalogInput newTag = await _userService.AddNewAnalogTag(analogTag, userId);
            if (newTag == null)
            {
                return NotFound();
            }
            return newTag;
        }

        [HttpPost("{userId}/addTag/digital")]
        public async Task<ActionResult<DigitalInput>> AddNewDigitalTag(string userId, DigitalTagDTO digitalTag)
        {
            DigitalInput newTag = await _userService.AddNewDigitalTag(digitalTag, userId);
            if (newTag == null)
            {
                return NotFound();
            }
            return newTag;
        }

        [HttpPut("{userId}/scanOnOff/analog/{ioAddress}")]
        public async Task<ActionResult> ChangeAnalogScanOnOff(string userId, string ioAddress, bool answer)
        {
            await _userService.ChangeAnalogScanOnOff(userId, ioAddress, answer);
            return Ok();
        }

        [HttpPut("{userId}/scanOnOff/digital/{ioAddress}")]
        public async Task<ActionResult> ChangeDigitalScanOnOff(string userId, string ioAddress, bool answer)
        {
            await _userService.ChangeDigitalScanOnOff(userId, ioAddress, answer);
            return Ok();
        }

        [HttpPut("{userId}/analog/{ioAddress}")]
        public async Task<ActionResult> DeleteAnalogAlarm(string userId, string ioAddress)
        {
            await _userService.DeleteAnalogAlarm(userId, ioAddress);
            return Ok();
        }

        [HttpPut("{userId}/digital/{ioAddress}")]
        public async Task<ActionResult> DeleteDigitalAlarm(string userId, string ioAddress)
        {
            await _userService.DeleteDigitalAlarm(userId, ioAddress);
            return Ok();
        }

        [HttpPut("logout")]
        public async Task<ActionResult> Logout(string userId)
        {
            await _userService.DeactivateUser(userId);
            return Ok();
        }
    }
}


