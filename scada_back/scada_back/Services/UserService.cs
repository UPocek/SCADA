using System;
namespace scada_back.Services
{
    public class UserService
    {
        private MongoDBService _mongo;
        public UserService(MongoDBService mongoDB)
        {
            _mongo = mongoDB;
        }


    }
}

