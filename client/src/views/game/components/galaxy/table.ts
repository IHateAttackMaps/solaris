import { type Ref, computed } from "vue";
import {SortInfo} from "@/services/data/sortInfo";
import GridHelper from "@/services/gridHelper";
import type {Game, Player} from "@/types/game";
import type {MapObject} from "@solaris-common";
import GameHelper from "@/services/gameHelper";

const missingPropertyFallbackFunc = (playersMap: Ref<Map<string, Player>>) => (obj: Object, key: string) => {
  switch (key) {
    case 'ownedByPlayer':
      return playersMap.value.get(obj['ownedByPlayerId']);
    default:
      return null;
  }
};

const usePlayerMap = (game: Ref<Game>) => computed(() => new Map(game.value.galaxy.players.map(p => [p._id, p])));

export const useSortedData = <A extends MapObject<string>>(tableData: Ref<A[]>, sortInfo: Ref<SortInfo>, showAll: Ref<boolean>, game: Ref<Game>, searchFilter: (v: A) => boolean) => {
  const userPlayer = computed(() => GameHelper.getUserPlayer(game.value));
  const playersMap = usePlayerMap(game);

  const filteredTableData = computed(() => {
    let td = tableData.value;


    if (!showAll.value && userPlayer.value !== undefined) {
      td = tableData.value.filter(s => s.ownedByPlayerId === userPlayer.value!._id && searchFilter(s));
    }
    else {
      return tableData.value.filter(searchFilter);
    }

    return td;
  })

  return computed(() => GridHelper.dynamicSort(filteredTableData.value, sortInfo.value, missingPropertyFallbackFunc(playersMap)));
};
