using Microsoft.Extensions.Options;
using MongoDB.Driver;
using scada_back.Models;
using scada_back.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ScadaDatabaseSettings>(
    builder.Configuration.GetSection("scada"));
builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<TagsService>();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("*").AllowAnyHeader()
                                                  .AllowAnyMethod(); ;
                      });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();