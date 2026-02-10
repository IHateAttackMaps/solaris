<template>
<div class="container">
  <div class="row mb-2 g-0">
    <div class="col-auto">
      <button class="btn btn-sm" :class="{ 'btn-danger': !showAll, 'btn-success': showAll }" @click="toggleShowAll" v-if="userPlayer != null">
        <span v-if="!showAll">Show All</span>
        <span v-if="showAll">Show Yours</span>
      </button>
    </div>
    <div class="col ms-2 me-2">
      <input type="text" class="form-control form-control-sm" v-model="searchFilter" placeholder="Search...">
    </div>
  </div>

  <div class="row">
    <div class="table-responsive">
      <table class="table table-striped table-hover mb-0">
          <thead class="table-dark">
              <tr>
                  <td title="Player"><a href="javascript:;" @click="sort(['ownedByPlayer','alias'], ['ownedByPlayerId'], ['name'])"><i class="fas fa-user"></i></a></td>
                  <td><a href="javascript:;" @click="sort(['name'])">Name</a></td>
                  <td></td>
                  <td title="Specialist">
                    <a href="javascript:;" @click="sort(['specialist', 'name'])"><i class="fas fa-user-astronaut"></i></a>
                  </td>
                  <td title="Economy Infrastructure" class="text-end">
                    <a href="javascript:;" @click="sort(['infrastructure','economy'])"><i class="fas fa-money-bill-wave me-2"></i></a>
                  </td>
                  <td title="Industry Infrastructure" class="text-end">
                    <a href="javascript:;" @click="sort(['infrastructure','industry'])"><i class="fas fa-tools me-2"></i></a>
                  </td>
                  <td title="Science Infrastructure" class="text-end">
                    <a href="javascript:;" @click="sort(['infrastructure','science'])"><i class="fas fa-flask"></i></a>
                  </td>
              </tr>
          </thead>
          <tbody>
              <capital-row v-for="star in sortedFilteredTableData" v-bind:key="star._id" :star="star"
                @onOpenStarDetailRequested="onOpenStarDetailRequested"/>
          </tbody>
      </table>
    </div>
  </div>

  <p v-if="!sortedFilteredTableData.length" class="text-center mt-2 mb-2">No stars to display.</p>
</div>
</template>

<script setup lang="ts">
import GameHelper from '../../../../services/gameHelper'
import GridHelper from '../../../../services/gridHelper'
import CapitalRow from './CapitalRow.vue'
import { SortInfo } from '../../../../services/data/sortInfo'
import { ref, inject,  onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';
import type {Game, Star} from "@/types/game";
import {loadLocalPreference, storeLocalPreference} from "@/util/localPreference";

const emit = defineEmits<{
  onOpenStarDetailRequested: [starId: string],
}>();

const SORT_INFO_KEY = "galaxy_capitals_sortInfo";

const defaultSortInfo = new SortInfo([['name']], true);

const store = useStore();
const game = computed<Game>(() => store.state.game);

const sortInfo = ref(new SortInfo([['name']], true));
const showAll = ref(false);
const searchFilter = ref('');

const isGameFinished = computed(() => GameHelper.isGameFinished(game.value));
const userPlayer = computed(() => GameHelper.getUserPlayer(game.value));
const playersMap = computed(() => new Map(game.value.galaxy.players.map(p => [p._id, p])));
const tableData = computed(() => game.value.galaxy.stars);
const filteredTableData = computed(() => {
  let td = tableData.value;

  const isHomeStar = (s: Star) => s.homeStar;
  const isSearchFilterMatch = (s: Star) => s.name.toLowerCase().includes(searchFilter.value.toLowerCase());

  if (!showAll.value && userPlayer.value !== null && userPlayer.value !== undefined) {
    td = tableData.value.filter(s => s.ownedByPlayerId === userPlayer.value!._id && isSearchFilterMatch(s) && isHomeStar(s));
  }
  else {
    return tableData.value.filter(s => isSearchFilterMatch(s) && isHomeStar(s));
  }

  return td;
})

const sortedFilteredTableData = computed(() => GridHelper.dynamicSort(filteredTableData.value, sortInfo.value, missingPropertyFallbackFunc));

const toggleShowAll = () => showAll.value = !showAll.value;

const sort = (...propertyPaths: string[][]) => {
  sortInfo.value = new SortInfo(propertyPaths, sortInfo.value.sortAscending);
};

const onOpenStarDetailRequested = (starId: string) => emit('onOpenStarDetailRequested', starId);

const missingPropertyFallbackFunc = (obj: Object, key: string) => {
  switch (key) {
    case 'ownedByPlayer':
      return playersMap.value.get(obj['ownedByPlayerId']);
    default:
      return null;
  }
};

onMounted(() => {
  sortInfo.value = loadLocalPreference(SORT_INFO_KEY, defaultSortInfo);
  showAll.value = !Boolean(userPlayer.value);

  onUnmounted(() => {
    storeLocalPreference(SORT_INFO_KEY, sortInfo.value);
  });
});
</script>

<style scoped>
td {
  padding: 12px 6px !important;
}
</style>
