var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();   // enables index.html
app.UseStaticFiles();    // enables serving HTML, CSS, JS

app.Run();

