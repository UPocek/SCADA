using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class Alarm
    {
        public string Direction { get; set; }
        public double Value { get; set; }
        public int Priority { get; set; }

        public Alarm()
        {
        }
    }
}

