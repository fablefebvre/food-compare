<!-- inspired from https://jsfiddle.net/taha_sh/krn9v4vr/ -->
<template>
  <div class="findBar">
    <p class="control has-icon has-icon-right">
      <input v-model="keyword" class="input is-large" placeholder="Search..." @input="onInput($event.target.value)" @keyup.esc="isOpen = false" @blur="isOpen = false" @keydown.down="moveDown" @keydown.up="moveUp" @keydown.enter="select">
      <i class="fa fa-angle-down"></i>
    </p>
    <ul v-show="isOpen" class="categories-list">
      <li v-for="(category, index) in fCategories" :class="{
          'highlighted': index === highlightedPosition
        }" @mouseenter="highlightedPosition = index" @mousedown="select">
        {{category.label_fr}}
      </li>
    </ul>
  </div>
</template>
<style>
input {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.findBar {
  position: relative;
}

ul.categories-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  margin-top: -12px;
  border: 1px solid #dbdbdb;
  border-radius: 0 0 3px 3px;
  position: absolute;
  width: 100%;
  overflow: hidden;
}

ul.categories-list li {
  display: inline-block;
  margin: 0 10px;
  width: 100%;
  flex-wrap: wrap;
  background: white;
  margin: 0;
  border-bottom: 1px solid #eee;
  color: #363636;
  padding: 7px;
  cursor: pointer;
}

ul.categories-list li.highlighted {
  background: #f8f8f8
}
</style>
<script>
export default{
	name: 'findBar',
    props: {
      categories: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        isOpen: false,
        highlightedPosition: 0,
        keyword: ''
      }
    },
    computed: {
      fCategories() {
        const re = new RegExp(this.keyword, 'i')
        return this.categories.filter(o => o.label_fr.match(re))
      }
    },
    methods: {
      onInput(value) {
          this.highlightedPosition = 0
          this.isOpen = !!value
        },
        moveDown() {
          if (!this.isOpen) {
            return
          }
          this.highlightedPosition =
            (this.highlightedPosition + 1) % this.fCategories.length
        },
        moveUp() {
          if (!this.isOpen) {
            return
          }
          this.highlightedPosition = this.highlightedPosition - 1 < 0 ? this.fCategories.length - 1 : this.highlightedPosition - 1
        },
        select() {
          const selectedCategory = this.fCategories[this.highlightedPosition]
          this.$emit('select', selectedCategory)
          this.isOpen = false
          this.keyword = selectedCategory.title
        }
    }
 }
</script>