using Microsoft.Extensions.Options;
using MongoDB.Driver;
using scada_back.Hubs;
using scada_back.Models;
using scada_back.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ScadaDatabaseSettings>(
    builder.Configuration.GetSection("scada"));
builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<TagsService>();
builder.Services.AddSingleton<UserService>();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// WebSocket - SignalR
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
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

app.MapHub<TagsHub>("/hubs/tags");

app.Run();