using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using scada_back.DTOs;

namespace scada_back.Models
{
    public class Alarm
    {
        public string Direction { get; set; }
        public double Value { get; set; }
        public int Priority { get; set; }

        public Alarm(AlarmDTO alarm)
        {
            Direction = alarm.Direction;
            Value = alarm.Value;
            Priority = alarm.Priority;
        }

        public Alarm(string direction, double value, int priority)
        {
            Direction = direction;
            Value = value;
            Priority = priority;
        }

        public Alarm()
        {
        }
    }
}

