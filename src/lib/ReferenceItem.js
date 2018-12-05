export default class ReferenceItem {
  constructor(props = {}) {
    this.mode = props.mode || 'text';
    this.value = props.value || '';
  }
  getMode() {
    return this.mode;
  }
  setMode(mode) {
    this.mode = mode;
  }
  getValue() {
    return this.value;
  }
  setValue(value) {
    this.value = value;
  }
}
