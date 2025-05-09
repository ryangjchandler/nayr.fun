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
<body {{ $attributes->class('bg-neutral-950 antialiased min-h-screen w-screen flex flex-col px-10 text-neutral-50 text-sm tracking-tight py-10') }}>
    <header class="flex flex-col gap-y-1.5">
        <a href="{{ route('index') }}" class="font-bold">
            ryan's fun stuff
        </a>

        <p>a collection of random programming experiments</p>
    </header>

    <main class="flex-1 mt-10">{{ $slot }}</main>
</body>
</html>
