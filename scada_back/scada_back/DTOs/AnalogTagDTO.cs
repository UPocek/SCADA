using scada_back.Models;
using System;
namespace scada_back.DTOs
{
    public class AnalogTagDTO
    {
        public string Description { get; set; }
        public string IOAddress { get; set; }
        public int ScanTime { get; set; }
        public double LowLimit { get; set; }
        public double HighLimit { get; set; }

        public AnalogTagDTO(string description, string iOAddress, int scanTime, double lowLimit, double highLimit)
        {
            Description = description;
            IOAddress = iOAddress;
            ScanTime = scanTime;
            LowLimit = lowLimit;
            HighLimit = highLimit;
        }


        public AnalogTagDTO()
        {
        }
    }
}

