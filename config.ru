use Rack::Static, 
  :urls => ["/css/","/fonts/","/js/","/img","/graph.html","/about.html","/help.html","/login.html"],
  :root => "public"

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/index.html', File::RDONLY)
  ]
}