using System;
namespace scada_back.DTOs
{
    public class UserCredentialsDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }

        public UserCredentialsDTO(string username, string password, string name, string surname) : this(username, password)
        {
            Name = name;
            Surname = surname;
        }

        public UserCredentialsDTO(string username, string password)
        {
            Username = username;
            Password = password;
        }

        public UserCredentialsDTO()
        {

        }
    }
}

