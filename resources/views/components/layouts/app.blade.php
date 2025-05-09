@props([
    'title' => null,
])

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @isset($title)
        <title>{{ $title }} – nayr.fun</title>
    @else
        <title>nayr.fun</title>
    @endisset
    @vite([
        'resources/css/app.css',
        'resources/js/app.js',
    ])
</head>
<body {{ $attributes->class('bg-neutral-950 antialiased min-h-screen w-screen flex flex-col') }}>
    {{ $slot }}
</body>
</html>
