using scada_back.Models;
using System;
namespace scada_back.DTOs
{
    public class UserTagsInfoDTO
    {
        public ICollection<AnalogInput> AnalogInputs { get; set; }
        public ICollection<DigitalInput> DigitalInputs { get; set; }
        public List<string> AvailableAnalogInputs { get; set; }
        public List<string> AvailableDigitalInputs { get; set; }

        public UserTagsInfoDTO(ICollection<AnalogInput> analogInputs, ICollection<DigitalInput> digitalInputs, List<string> availableAnalogInputs, List<string> availableDigitalInputs)
        {
            AnalogInputs = analogInputs;
            DigitalInputs = digitalInputs;
            AvailableAnalogInputs = availableAnalogInputs;
            AvailableDigitalInputs = availableDigitalInputs;
        }

        public UserTagsInfoDTO()
        {
        }
    }
}
