"use strict"; // TODO This was copied from App Search api client, should probably have a
// specific type just for Search UI

/**
 * An individual search result
 */

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ResultItem =
/*#__PURE__*/
function () {
  function ResultItem(data) {
    _classCallCheck(this, ResultItem);

    if (data._group && data._group.length > 0) {
      data = _objectSpread({}, data, {
        _group: data._group.map(function (nestedData) {
          return new ResultItem(nestedData);
        })
      });
    }

    this.data = data;
  }
  /**
   * Return the HTML-unsafe raw value for a field, if it exists
   *
   * @param {String} key - name of the field
   *
   * @returns {any} the raw value of the field
   */


  _createClass(ResultItem, [{
    key: "getRaw",
    value: function getRaw(key) {
      return (this.data[key] || {}).raw;
    }
    /**
     * Return the HTML-safe snippet value for a field, if it exists
     *
     * @param {String} key - name of the field
     *
     * @returns {any} the snippet value of the field
     */

  }, {
    key: "getSnippet",
    value: function getSnippet(key) {
      return (this.data[key] || {}).snippet;
    }
  }]);

  return ResultItem;
}();

export { ResultItem as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXN1bHRJdGVtLmpzIl0sIm5hbWVzIjpbIlJlc3VsdEl0ZW0iLCJkYXRhIiwiX2dyb3VwIiwibGVuZ3RoIiwibWFwIiwibmVzdGVkRGF0YSIsImtleSIsInJhdyIsInNuaXBwZXQiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7OztJQUdxQkEsVTs7O0FBQ25CLHNCQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFFBQUlBLElBQUksQ0FBQ0MsTUFBTCxJQUFlRCxJQUFJLENBQUNDLE1BQUwsQ0FBWUMsTUFBWixHQUFxQixDQUF4QyxFQUEyQztBQUN6Q0YsTUFBQUEsSUFBSSxxQkFDQ0EsSUFERDtBQUVGQyxRQUFBQSxNQUFNLEVBQUVELElBQUksQ0FBQ0MsTUFBTCxDQUFZRSxHQUFaLENBQWdCLFVBQUFDLFVBQVU7QUFBQSxpQkFBSSxJQUFJTCxVQUFKLENBQWVLLFVBQWYsQ0FBSjtBQUFBLFNBQTFCO0FBRk4sUUFBSjtBQUlEOztBQUNELFNBQUtKLElBQUwsR0FBWUEsSUFBWjtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7OzJCQU9PSyxHLEVBQUs7QUFDVixhQUFPLENBQUMsS0FBS0wsSUFBTCxDQUFVSyxHQUFWLEtBQWtCLEVBQW5CLEVBQXVCQyxHQUE5QjtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7K0JBT1dELEcsRUFBSztBQUNkLGFBQU8sQ0FBQyxLQUFLTCxJQUFMLENBQVVLLEdBQVYsS0FBa0IsRUFBbkIsRUFBdUJFLE9BQTlCO0FBQ0Q7Ozs7OztTQS9Ca0JSLFUiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuLy8gVE9ETyBUaGlzIHdhcyBjb3BpZWQgZnJvbSBBcHAgU2VhcmNoIGFwaSBjbGllbnQsIHNob3VsZCBwcm9iYWJseSBoYXZlIGFcbi8vIHNwZWNpZmljIHR5cGUganVzdCBmb3IgU2VhcmNoIFVJXG5cbi8qKlxuICogQW4gaW5kaXZpZHVhbCBzZWFyY2ggcmVzdWx0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3VsdEl0ZW0ge1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgaWYgKGRhdGEuX2dyb3VwICYmIGRhdGEuX2dyb3VwLmxlbmd0aCA+IDApIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIF9ncm91cDogZGF0YS5fZ3JvdXAubWFwKG5lc3RlZERhdGEgPT4gbmV3IFJlc3VsdEl0ZW0obmVzdGVkRGF0YSkpXG4gICAgICB9O1xuICAgIH1cbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgSFRNTC11bnNhZmUgcmF3IHZhbHVlIGZvciBhIGZpZWxkLCBpZiBpdCBleGlzdHNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtIG5hbWUgb2YgdGhlIGZpZWxkXG4gICAqXG4gICAqIEByZXR1cm5zIHthbnl9IHRoZSByYXcgdmFsdWUgb2YgdGhlIGZpZWxkXG4gICAqL1xuICBnZXRSYXcoa2V5KSB7XG4gICAgcmV0dXJuICh0aGlzLmRhdGFba2V5XSB8fCB7fSkucmF3O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgSFRNTC1zYWZlIHNuaXBwZXQgdmFsdWUgZm9yIGEgZmllbGQsIGlmIGl0IGV4aXN0c1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gbmFtZSBvZiB0aGUgZmllbGRcbiAgICpcbiAgICogQHJldHVybnMge2FueX0gdGhlIHNuaXBwZXQgdmFsdWUgb2YgdGhlIGZpZWxkXG4gICAqL1xuICBnZXRTbmlwcGV0KGtleSkge1xuICAgIHJldHVybiAodGhpcy5kYXRhW2tleV0gfHwge30pLnNuaXBwZXQ7XG4gIH1cbn1cbiJdfQ==