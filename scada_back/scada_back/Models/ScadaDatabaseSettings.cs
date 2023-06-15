using System;
namespace scada_back.Models
{
    public class ScadaDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string AddressValueDigitalCollectionName { get; set; } = null!;
        public string AddressValueAnalogCollectionName { get; set; } = null!;
        public string UserCollectionName { get; set; } = null!;
    }
}

