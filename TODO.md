Create a svelte project to build a small set of web UIs for controlling the Reaper DAW remotely.

The UIs should be independent, descriptively-named html pages at the root of the build output dir.
They should use a shared set of js/css files.
The UIs should be able to run offline (all functionality encapsulated in the enclosed html/js/css files).

In order to rapidly build a sophisticated UI, utilize tailwind.
Seek to leverage tailwind classes and components as much as possible (as opposed to buiding custom CSS)

For reference, existing built-in UIs are at: ~/opt/REAPER/Plugins/reaper_www_root/