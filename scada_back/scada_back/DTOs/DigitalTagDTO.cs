using scada_back.Models;
using System;
namespace scada_back.DTOs
{
    public class DigitalTagDTO
    {
        public string Description { get; set; }
        public string IOAddress { get; set; }
        public int ScanTime { get; set; }

        public DigitalTagDTO(string description, string iOAddress, int scanTime)
        {
            Description = description;
            IOAddress = iOAddress;
            ScanTime = scanTime;
        }


        public DigitalTagDTO()
        {
        }
    }
}

