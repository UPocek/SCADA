using System;
namespace scada_back.Models
{
    public class ScadaDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string AnalogInputCollectionName { get; set; } = null!;
    }
}

