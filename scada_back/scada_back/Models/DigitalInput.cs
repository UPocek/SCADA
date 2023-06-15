using System;
namespace scada_back.Models
{
    public class DigitalInput
    {
        public string Id { get; set; }
        public string Description { get; set; }
        public string IOAddress { get; set; }
        public double ScanTime { get; set; }
        public bool OnOffScan { get; set; }

        public DigitalInput()
        {
        }
    }
}

