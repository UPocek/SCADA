using System;
namespace scada_back.DTOs
{
    public class AlarmMessageDTO
    {

        public string User { get; set; }
        public string Message { get; set; }
        public int Priority { get; set; }

        public AlarmMessageDTO(string user, string message, int priority)
        {
            User = user;
            Message = message;
            Priority = priority;
        }

        public AlarmMessageDTO()
        {
        }
    }
}

