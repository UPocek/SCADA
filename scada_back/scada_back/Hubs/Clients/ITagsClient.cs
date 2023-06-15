using System;
using scada_back.DTOs;

namespace scada_back.Hubs.Clients
{
    public interface ITagsClient
    {
        Task ReceiveMessage(TagMessageDTO message);
    }
}

