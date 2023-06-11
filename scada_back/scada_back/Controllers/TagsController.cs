using System;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public async Task<List<AnalogInput>> GetAnalogInputs()
        {
            return await _tagsService.GetAllAnalogInputsAsync();

        }

    }
}

