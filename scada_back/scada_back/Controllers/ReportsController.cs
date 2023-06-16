using System;
using Microsoft.AspNetCore.Mvc;
using scada_back.Models;
using scada_back.Services;
using scada_back.DTOs;

namespace scada_back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ReportsService _reportsService;

        public ReportsController(ReportsService reportsService)
        {
            _reportsService = reportsService;
        }

        // /api/Reports/allAlarmsByDate?from=&to=
        [HttpGet("allAlarmsByDate")]
        public async Task<List<AlarmInstance>> GetAlarmsByDateReport(string from, string to)
        {
            return await _reportsService.GetAllAlarmsForSpecificDateRange(from, to);
        }

        // /api/Reports/allAlarmsByPriority?priority=
        [HttpGet("allAlarmsByPriority")]
        public async Task<List<AlarmInstance>> GetAlarmsByPriorityReport(int priority)
        {
            return await _reportsService.GetAllAlarmsWithPriority(priority);
        }

        // /api/Reports/allHistoryValues?from=&to=
        [HttpGet("allHistoryValues")]
        public async Task<List<HistoryInstance>> GetAllTagValuesReport(string from, string to)
        {
            return await _reportsService.GetAllTagValues(from, to);
        }

        // /api/Reports/allAnalogValues
        [HttpGet("allAnalogValues")]
        public async Task<List<AddressValueAnalog>> GetAnalogValuesReport()
        {
            return await _reportsService.GetAnalogValues();
        }

        // /api/Reports/allDigitalValues
        [HttpGet("allDigitalValues")]
        public async Task<List<AddressValueDigital>> GetDigitalValuesReport()
        {
            return await _reportsService.GetDigitalValues();
        }

        // /api/Reports/allTagValues?tagId=
        [HttpGet("allTagValues")]
        public async Task<List<TagValueInstance>> GetTagValuesReport(string tagId)
        {
            return await _reportsService.GetTagValues(tagId);
        }
    }
}

