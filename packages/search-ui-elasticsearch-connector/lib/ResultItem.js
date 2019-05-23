"use strict"; // TODO This was copied from App Search api client, should probably have a
// specific type just for Search UI

/**
 * An individual search result
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

exports.default = ResultItem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXN1bHRJdGVtLmpzIl0sIm5hbWVzIjpbIlJlc3VsdEl0ZW0iLCJkYXRhIiwiX2dyb3VwIiwibGVuZ3RoIiwibWFwIiwibmVzdGVkRGF0YSIsImtleSIsInJhdyIsInNuaXBwZXQiXSwibWFwcGluZ3MiOiJBQUFBLGEsQ0FFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBR3FCQSxVOzs7QUFDbkIsc0JBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsUUFBSUEsSUFBSSxDQUFDQyxNQUFMLElBQWVELElBQUksQ0FBQ0MsTUFBTCxDQUFZQyxNQUFaLEdBQXFCLENBQXhDLEVBQTJDO0FBQ3pDRixNQUFBQSxJQUFJLHFCQUNDQSxJQUREO0FBRUZDLFFBQUFBLE1BQU0sRUFBRUQsSUFBSSxDQUFDQyxNQUFMLENBQVlFLEdBQVosQ0FBZ0IsVUFBQUMsVUFBVTtBQUFBLGlCQUFJLElBQUlMLFVBQUosQ0FBZUssVUFBZixDQUFKO0FBQUEsU0FBMUI7QUFGTixRQUFKO0FBSUQ7O0FBQ0QsU0FBS0osSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7MkJBT09LLEcsRUFBSztBQUNWLGFBQU8sQ0FBQyxLQUFLTCxJQUFMLENBQVVLLEdBQVYsS0FBa0IsRUFBbkIsRUFBdUJDLEdBQTlCO0FBQ0Q7QUFFRDs7Ozs7Ozs7OzsrQkFPV0QsRyxFQUFLO0FBQ2QsYUFBTyxDQUFDLEtBQUtMLElBQUwsQ0FBVUssR0FBVixLQUFrQixFQUFuQixFQUF1QkUsT0FBOUI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vLyBUT0RPIFRoaXMgd2FzIGNvcGllZCBmcm9tIEFwcCBTZWFyY2ggYXBpIGNsaWVudCwgc2hvdWxkIHByb2JhYmx5IGhhdmUgYVxuLy8gc3BlY2lmaWMgdHlwZSBqdXN0IGZvciBTZWFyY2ggVUlcblxuLyoqXG4gKiBBbiBpbmRpdmlkdWFsIHNlYXJjaCByZXN1bHRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzdWx0SXRlbSB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBpZiAoZGF0YS5fZ3JvdXAgJiYgZGF0YS5fZ3JvdXAubGVuZ3RoID4gMCkge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgX2dyb3VwOiBkYXRhLl9ncm91cC5tYXAobmVzdGVkRGF0YSA9PiBuZXcgUmVzdWx0SXRlbShuZXN0ZWREYXRhKSlcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBIVE1MLXVuc2FmZSByYXcgdmFsdWUgZm9yIGEgZmllbGQsIGlmIGl0IGV4aXN0c1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gbmFtZSBvZiB0aGUgZmllbGRcbiAgICpcbiAgICogQHJldHVybnMge2FueX0gdGhlIHJhdyB2YWx1ZSBvZiB0aGUgZmllbGRcbiAgICovXG4gIGdldFJhdyhrZXkpIHtcbiAgICByZXR1cm4gKHRoaXMuZGF0YVtrZXldIHx8IHt9KS5yYXc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBIVE1MLXNhZmUgc25pcHBldCB2YWx1ZSBmb3IgYSBmaWVsZCwgaWYgaXQgZXhpc3RzXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgLSBuYW1lIG9mIHRoZSBmaWVsZFxuICAgKlxuICAgKiBAcmV0dXJucyB7YW55fSB0aGUgc25pcHBldCB2YWx1ZSBvZiB0aGUgZmllbGRcbiAgICovXG4gIGdldFNuaXBwZXQoa2V5KSB7XG4gICAgcmV0dXJuICh0aGlzLmRhdGFba2V5XSB8fCB7fSkuc25pcHBldDtcbiAgfVxufVxuIl19