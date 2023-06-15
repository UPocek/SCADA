using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class AnalogInput : Tag
    {
        public string Id { get; set; }
        public string Description { get; set; }
        public string IOAddress { get; set; }
        public double ScanTime { get; set; }
        public ICollection<Alarm> Alarms { get; set; } = new List<Alarm>();
        public bool OnOffScan { get; set; }
        public double LowLimit { get; set; }
        public double HighLimit { get; set; }
        public string Units { get; set; }

        public AnalogInput()
        {
        }
    }
}

