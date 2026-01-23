import {GetRoute, SimpleGetRoute} from "./index";
import type {GuildRank} from "../../types/common/guild";

export const createGuildRoutes = <ID>() => ({
    listGuilds: new SimpleGetRoute<GuildRank<ID>[]>("guild/list"),
});
