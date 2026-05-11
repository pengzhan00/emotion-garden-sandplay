import Cocoa
import WebKit

@main
class AppDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate {

    var window: NSWindow!
    var webView: WKWebView!

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Create window
        let screenSize = NSScreen.main?.frame.size ?? NSSize(width: 1280, height: 800)
        let windowRect = NSRect(x: 0, y: 0,
                                width: min(screenSize.width * 0.85, 1400),
                                height: min(screenSize.height * 0.85, 900))
        
        window = NSWindow(
            contentRect: windowRect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        
        window.title = "🌱 情绪花园 — 数字沙盘"
        window.center()
        window.titlebarAppearsTransparent = true
        window.isMovableByWindowBackground = true
        
        // Configure WebView
        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "developerExtrasEnabled")
        
        webView = WKWebView(frame: window.contentView!.bounds, configuration: config)
        webView.navigationDelegate = self
        webView.autoresizingMask = [.width, .height]
        webView.setValue(false, forKey: "drawsBackground")
        
        window.contentView?.addSubview(webView)
        
        // Load local HTML file
        loadLocalHTML()
        
        window.makeKeyAndOrderFront(nil)
        NSApp.setActivationPolicy(.regular)
        NSApp.activate(ignoringOtherApps: true)
    }
    
    func loadLocalHTML() {
        guard let resourcePath = Bundle.main.resourcePath else {
            fatalError("Could not find resource path")
        }
        
        let htmlPath = resourcePath + "/情绪花园_数字沙盘.html"
        let htmlURL = URL(fileURLWithPath: htmlPath)
        let baseURL = htmlURL.deletingLastPathComponent()
        
        if FileManager.default.fileExists(atPath: htmlPath) {
            webView.loadFileURL(htmlURL, allowingReadAccessTo: baseURL)
        } else {
            // Fallback: try loading from main bundle
            if let bundleURL = Bundle.main.url(forResource: "情绪花园_数字沙盘", withExtension: "html") {
                webView.loadFileURL(bundleURL, allowingReadAccessTo: bundleURL.deletingLastPathComponent())
            } else {
                fatalError("情绪花园_数字沙盘.html not found in bundle")
            }
        }
    }
    
    // Allow all navigation (including local file access)
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        decisionHandler(.allow)
    }
    
    // Handle window close - quit app
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
    
    // Prevent app from sleeping while running
    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        return .terminateNow
    }
}
