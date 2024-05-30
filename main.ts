export default class OrionServer {
  private url: string;
  private proxy: any;

  constructor(url: string) {
    this.url = url;
    this.proxy = new Proxy(
      {},
      {
        get: (target, propKey) => {
          if (typeof propKey === "string" || typeof propKey === "symbol") {
            return async (...args: any[]) => {
              const res = await fetch(this.url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  handler: String(propKey),
                  args,
                }),
              });
              return await res.json();
            };
          }
          return target[propKey];
        },
      }
    );
  }

  getApp(): any {
    return this.proxy;
  }
}

// Usage
// const server = new OrionServer("http://localhost:3000");
// const app = server.getApp();
