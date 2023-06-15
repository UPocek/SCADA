using System;
namespace scada_back.Models
{
    public class DigitalInput : TagMain
    {
        public string Id { get; set; }
        public string Description { get; set; }
        public string IOAddress { get; set; }
        public int ScanTime { get; set; }
        public bool OnOffScan { get; set; }
        public int Value { get; set; }

        public DigitalInput(string id, string description, string iOAddress, int scanTime, bool onOffScan, int value)
        {
            Id = id;
            Description = description;
            IOAddress = iOAddress;
            ScanTime = scanTime;
            OnOffScan = onOffScan;
            Value = value;
        }

        public DigitalInput()
        {
        }
    }
}

