import sys
from rich.syntax import Syntax
from rich.traceback import Traceback
from textual.app import App, ComposeResult
from textual.containers import Container, VerticalScroll
from textual.reactive import reactive, var
from textual.widgets import DirectoryTree, Footer, Header, Static


class CodeBrowser(App):

    CSS_PATH = "codeDisplay.tcss"
    BINDINGS = [
        ("f", "toggle_files", "Toggle Files"),
        ("q", "quit", "Quit"),
    ]

    show_tree = var(True)
    path: reactive[str | None] = reactive(None)

    def watch_show_tree(self, show_tree: bool) -> None:
        self.set_class(show_tree, "-show-tree")

    def compose(self) -> ComposeResult:
        path = "./display/repository/" if len(sys.argv) < 2 else sys.argv[1]
        yield Header()
        with Container():
            yield DirectoryTree(path, id="tree-view")   
            with VerticalScroll(id="code-view"):
                yield Static(id="code", expand=True)
        yield Footer()

    def on_mount(self) -> None:
        self.query_one(DirectoryTree).focus()

        def theme_change(_signal) -> None:
            self.watch_path(self.path)

        self.theme_changed_signal.subscribe(self, theme_change)

    def on_directory_tree_file_selected(
        self, event: DirectoryTree.FileSelected
    ) -> None:
        event.stop()
        self.path = str(event.path)

    def watch_path(self, path: str | None) -> None:
        code_view = self.query_one("#code", Static)
        if path is None:
            code_view.update("")
            return
        try:
            syntax = Syntax.from_path(
                path,
                line_numbers=True,
                word_wrap=False,
                indent_guides=True,
                theme="github-dark" if self.current_theme.dark else "github-light",
            )
        except Exception:
            code_view.update(Traceback(theme="github-dark", width=None))
            self.sub_title = "ERROR"
        else:
            code_view.update(syntax)
            self.query_one("#code-view").scroll_home(animate=False)
            self.sub_title = path

    def action_toggle_files(self) -> None:
        self.show_tree = not self.show_tree


if __name__ == "__main__":
    while True:
        try:
            CodeBrowser().run()
        except KeyboardInterrupt:
            continue
        except Exception as error:
            print(f"An error has occurred in the display. Please contact the developer. Error {error}")