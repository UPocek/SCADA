using System;
using System.Security.Claims;
using Amazon.Runtime.Internal;
using MongoDB.Driver;
using scada_back.DTOs;
using scada_back.Models;

namespace scada_back.Services
{
    public class ReportsService
    {
        private readonly MongoDBService _mongo;
        public ReportsService(MongoDBService mongoDB)
        {
            _mongo = mongoDB;
        }

        public async Task<List<AlarmInstance>> GetAllAlarmsForSpecificDateRange(DateRangeRequestDTO request)
        {
            return await _mongo._alarmCollection.Find(alarm => alarm.Date > DateTime.Parse(request.From) & alarm.Date < DateTime.Parse(request.To)).ToListAsync();
        }

        public async Task<List<AlarmInstance>> GetAllAlarmsWithPriority(int priority)
        {
            return await _mongo._alarmCollection.Find(alarm => alarm.Priority == priority).ToListAsync();
        }

        public async Task<List<HistoryInstance>> GetAllTagValues(DateRangeRequestDTO request)
        {
            return await _mongo._historyCollection.Find(item => item.Date > DateTime.Parse(request.From) & item.Date < DateTime.Parse(request.To)).ToListAsync();
        }

        public async Task<List<AddressValueAnalog>> GetAnalogValues()
        {
            return await _mongo._addressValueAnalogCollection.Find(_ => true).ToListAsync();
        }

        public async Task<List<AddressValueDigital>> GetDigitalValues()
        {
            return await _mongo._addressValueDigitalCollection.Find(_ => true).ToListAsync();
        }

        public async Task<List<TagValueInstance>> GetTagValues(string tagId)
        {
            return await _mongo._tagvalueCollection.Find(tag => tag.TagId == tagId).ToListAsync();
        }
    }
}

