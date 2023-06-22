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

        public async Task<List<AlarmInstance>> GetAllAlarmsForSpecificDateRange(string from, string to)
        {
            return await _mongo._alarmCollection.Find(alarm => alarm.Date > DateTime.Parse(from) & alarm.Date < DateTime.Parse(to)).ToListAsync();
        }

        public async Task<List<AlarmInstance>> GetAllAlarmsWithPriority(int priority)
        {
            return await _mongo._alarmCollection.Find(alarm => alarm.Priority == priority).ToListAsync();
        }

        public async Task<List<HistoryInstance>> GetAllTagValues(string from, string to)
        {
            return await _mongo._historyCollection.Find(item => item.Date > DateTime.Parse(from) & item.Date < DateTime.Parse(to)).ToListAsync();
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

