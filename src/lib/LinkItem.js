export default class LinkItem {
  constructor(props = {}) {
    this.value = props.value || '/';
  }
  getValue() {
    return this.value;
  }
  setValue(value) {
    this.value = value;
  }
  getType() {
    return 'link';
  }
}
