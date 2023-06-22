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

        public string AlarmCollectionName { get; set; } = null!;

        public string TagValueCollectionName { get; set; } = null!;

        public string HistoryCollectionName { get; set; } = null!;

        public string ControlAnalogCollectionName { get; set; } = null!;

        public string ControlDigitalCollectionName { get; set; } = null!;
    }
}

