using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using scada_back.DTOs;
using scada_back.Hubs;
using scada_back.Hubs.Clients;
using scada_back.Models;
using scada_back.Services;

namespace scada_back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : ControllerBase
    {

        private readonly TagsService _tagsService;

        public TagsController(TagsService tagsService)
        {
            _tagsService = tagsService;
        }

        [HttpGet("analog")]
        public async Task<List<AddressValueAnalog>> GetAnalogAddresses()
        {
            return await _tagsService.GetAllAnalogAddressesAsync();
        }

        [HttpGet("digital")]
        public async Task<List<AddressValueDigital>> GetDigitalAddresses()
        {
            return await _tagsService.GetAllDigitalAddressesAsync();
        }

        [HttpPut("digital/{address}")]
        public async Task<IActionResult> UpdateDigitalTag(string address, int value)
        {
            await _tagsService.UpdateDigitalTag(address, value);
            return Ok();
        }

        [HttpPut("analog/{address}")]
        public async Task<IActionResult> UpdateAnalogTag(string address, double value)
        {
            await _tagsService.UpdateAnalogTag(address, value);
            return Ok();
        }

        [HttpPut("control/{address}")]
        public async Task<IActionResult> ControlTag(string address, double value, string type)
        {
            try
            {
                await _tagsService.ControlTag(address, value, type);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("controls")]
        public async Task<List<ControlValuesDTO>> GetControlValues()
        {
            return await _tagsService.GetAllControlValues();
        }
    }
}

