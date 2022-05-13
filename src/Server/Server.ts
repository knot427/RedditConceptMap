import express, {Application, Request, Response} from "express";
import * as http from "http";
import cors from "cors";
import DataManager from "../DataManager/DataManager";
import RealDataManager from "../DataManager/RealDataManager";

export default class Server {
    private readonly port: number;
    private express: Application;
    private server: http.Server | undefined;

    private dataManager: DataManager;

    private readonly defaultCommunity: string = "all"

    constructor(port: number) {
        this.dataManager = new RealDataManager();

        console.info(`Server::<init>( ${port} )`);
        this.port = port;
        this.express = express();

        this.registerMiddleware();
        this.registerRoutes();

        // NOTE: you can serve static frontend files in from your express server
        // by uncommenting the line below. This makes files in ./frontend/public
        // accessible at http://localhost:<port>/
        this.express.use(express.static("./frontend"));
    }

    /**
     * Starts the server. Returns a promise that resolves if success. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<void>}
     */
    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.info("Server::start() - start");
            if (this.server !== undefined) {
                console.error("Server::start() - server already listening");
                reject();
            } else {
                this.server = this.express
                    .listen(this.port, () => {
                        console.info(`Server::start() - server listening on port: ${this.port}`);
                        resolve();
                    })
                    .on("error", (err: Error) => {
                        // catches errors in server start
                        console.error(`Server::start() - server ERROR: ${err.message}`);
                        reject(err);
                    });
            }
        });
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<void>}
     */
    public stop(): Promise<void> {
        console.info("Server::stop()");
        return new Promise((resolve, reject) => {
            if (this.server === undefined) {
                console.error("Server::stop() - ERROR: server not started");
                reject();
            } else {
                this.server.close(() => {
                    console.info("Server::stop() - server closed");
                    resolve();
                });
            }
        });
    }

    // Registers middleware to parse request before passing them to request handlers
    private registerMiddleware() {
        // JSON parser must be place before raw parser because of wildcard matching done by raw parser below
        this.express.use(express.json());
        this.express.use(express.raw({type: "application/*", limit: "10mb"}));

        // enable cors in request headers to allow cross-origin HTTP requests
        this.express.use(cors());
    }

    // Registers all request handlers to routes
    private registerRoutes() {
        // This is an example endpoint this you can invoke by accessing this URL in your browser:
        // http://localhost:4321/echo/hello
        //this.express.get("/echo/:msg", Server.echo);

        this.express.get("/:community", this.retrieveCommunity);
        this.express.get("/", this.retrieveDefaultCommunity);

        // TODO: your other endpoints should go here
        // this.express.put("/dataset/:id/:kind", Server.putDataset);

        // this.express.delete("/dataset/:id", Server.deleteDataset);

        // this.express.post("/query", Server.query);

        // this.express.get("/datasets", Server.getDatasets);
    }

    private retrieveCommunityInfo(community: string): {} {
        let info: undefined | {} = undefined;
        if (typeof community !== "undefined" && community !== null) {
            info = this.dataManager.retrieveCommunityInformation(community);
        }
        if (typeof info === "undefined") {
            throw new Error("Community Not Found");
        } else {
            return info
        }
    }

    private retrieveCommunity(req: Request, res: Response) {
        try {
            console.log(`Server::retrieveCommunity(..) - params: ${JSON.stringify(req.params)}`);
            const response = this.retrieveCommunityInfo(req.params.community);
            res.status(200).json({result: response});
        } catch (err) {
            res.status(400).json({error: err});
        }
    }

    private retrieveDefaultCommunity(req: Request, res: Response) {
        try {
            console.log(`Server::retrieveDefaultCommunity(..) - params: ${JSON.stringify(req.params)}`);
            const response = this.retrieveCommunityInfo(this.defaultCommunity);
            res.status(200).json({result: response});
        } catch (err) {
            res.status(400).json({error: err});
        }
    }
}
