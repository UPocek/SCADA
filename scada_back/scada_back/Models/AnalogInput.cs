using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using scada_back.DTOs;

namespace scada_back.Models
{
    public class AnalogInput : TagMain
    {
        public string Id { get; set; }
        public string Description { get; set; }
        public string IOAddress { get; set; }
        public int ScanTime { get; set; }
        public ICollection<Alarm> Alarms { get; set; } = new List<Alarm>();
        public bool OnOffScan { get; set; }
        public double LowLimit { get; set; }
        public double HighLimit { get; set; }
        public string Units { get; set; }
        public double Value { get; set; }

        public AnalogInput(string id, string description, string iOAddress, int scanTime, ICollection<Alarm> alarms, bool onOffScan, double lowLimit, double highLimit, string units, double value)
        {
            Id = id;
            Description = description;
            IOAddress = iOAddress;
            ScanTime = scanTime;
            Alarms = alarms;
            OnOffScan = onOffScan;
            LowLimit = lowLimit;
            HighLimit = highLimit;
            Units = units;
            Value = value;
        }

        public AnalogInput(AnalogTagDTO analogTagDTO, string units, double value)
        {
            Id = Guid.NewGuid().ToString();
            Description = analogTagDTO.Description;
            IOAddress = analogTagDTO.IOAddress;
            ScanTime = analogTagDTO.ScanTime;
            Alarms = new List<Alarm>();
            OnOffScan = true;
            LowLimit = analogTagDTO.LowLimit;
            HighLimit = analogTagDTO.HighLimit;
            Units = units;
            Value = value;
        }

        public AnalogInput()
        {
        }
    }
}

