"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toResultList = toResultList;

var _ResultList = _interopRequireDefault(require("./ResultList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function toResultList(response) {
  var results = getResults(response.hits.hits);
  var info = getInfo(response.hits);
  return new _ResultList.default(results, info);
}

var addEachKeyValueToObject = function addEachKeyValueToObject(acc, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];

  return _objectSpread({}, acc, _defineProperty({}, key, value));
};

function getInfo(hits) {
  return {
    meta: {
      warnings: [],
      // TODO
      page: {
        current: 1,
        // TODO
        total_pages: 10,
        size: 10,
        total_results: hits.total
      },
      request_id: "" // TODO

    }
  };
}

function getResults(records) {
  var toObjectWithRaw = function toObjectWithRaw(value) {
    return {
      raw: value
    };
  };

  return records.map(function (record) {
    return Object.entries(record._source).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          fieldName = _ref4[0],
          fieldValue = _ref4[1];

      return [fieldName, toObjectWithRaw(fieldValue)];
    }).reduce(addEachKeyValueToObject, {});
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXNwb25zZUFkYXB0ZXJzLmpzIl0sIm5hbWVzIjpbInRvUmVzdWx0TGlzdCIsInJlc3BvbnNlIiwicmVzdWx0cyIsImdldFJlc3VsdHMiLCJoaXRzIiwiaW5mbyIsImdldEluZm8iLCJSZXN1bHRMaXN0IiwiYWRkRWFjaEtleVZhbHVlVG9PYmplY3QiLCJhY2MiLCJrZXkiLCJ2YWx1ZSIsIm1ldGEiLCJ3YXJuaW5ncyIsInBhZ2UiLCJjdXJyZW50IiwidG90YWxfcGFnZXMiLCJzaXplIiwidG90YWxfcmVzdWx0cyIsInRvdGFsIiwicmVxdWVzdF9pZCIsInJlY29yZHMiLCJ0b09iamVjdFdpdGhSYXciLCJyYXciLCJtYXAiLCJyZWNvcmQiLCJPYmplY3QiLCJlbnRyaWVzIiwiX3NvdXJjZSIsImZpZWxkTmFtZSIsImZpZWxkVmFsdWUiLCJyZWR1Y2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLFNBQVNBLFlBQVQsQ0FBc0JDLFFBQXRCLEVBQWdDO0FBQ3JDLE1BQU1DLE9BQU8sR0FBR0MsVUFBVSxDQUFDRixRQUFRLENBQUNHLElBQVQsQ0FBY0EsSUFBZixDQUExQjtBQUNBLE1BQU1DLElBQUksR0FBR0MsT0FBTyxDQUFDTCxRQUFRLENBQUNHLElBQVYsQ0FBcEI7QUFDQSxTQUFPLElBQUlHLG1CQUFKLENBQWVMLE9BQWYsRUFBd0JHLElBQXhCLENBQVA7QUFDRDs7QUFFRCxJQUFNRyx1QkFBdUIsR0FBRyxTQUExQkEsdUJBQTBCLENBQUNDLEdBQUQ7QUFBQTtBQUFBLE1BQU9DLEdBQVA7QUFBQSxNQUFZQyxLQUFaOztBQUFBLDJCQUMzQkYsR0FEMkIsc0JBRTdCQyxHQUY2QixFQUV2QkMsS0FGdUI7QUFBQSxDQUFoQzs7QUFLQSxTQUFTTCxPQUFULENBQWlCRixJQUFqQixFQUF1QjtBQUNyQixTQUFPO0FBQ0xRLElBQUFBLElBQUksRUFBRTtBQUNKQyxNQUFBQSxRQUFRLEVBQUUsRUFETjtBQUNVO0FBQ2RDLE1BQUFBLElBQUksRUFBRTtBQUNKQyxRQUFBQSxPQUFPLEVBQUUsQ0FETDtBQUNRO0FBQ1pDLFFBQUFBLFdBQVcsRUFBRSxFQUZUO0FBR0pDLFFBQUFBLElBQUksRUFBRSxFQUhGO0FBSUpDLFFBQUFBLGFBQWEsRUFBRWQsSUFBSSxDQUFDZTtBQUpoQixPQUZGO0FBUUpDLE1BQUFBLFVBQVUsRUFBRSxFQVJSLENBUVc7O0FBUlg7QUFERCxHQUFQO0FBWUQ7O0FBRUQsU0FBU2pCLFVBQVQsQ0FBb0JrQixPQUFwQixFQUE2QjtBQUMzQixNQUFNQyxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUFYLEtBQUs7QUFBQSxXQUFLO0FBQUVZLE1BQUFBLEdBQUcsRUFBRVo7QUFBUCxLQUFMO0FBQUEsR0FBN0I7O0FBRUEsU0FBT1UsT0FBTyxDQUFDRyxHQUFSLENBQVksVUFBQUMsTUFBTSxFQUFJO0FBQzNCLFdBQU9DLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlRixNQUFNLENBQUNHLE9BQXRCLEVBQ0pKLEdBREksQ0FDQTtBQUFBO0FBQUEsVUFBRUssU0FBRjtBQUFBLFVBQWFDLFVBQWI7O0FBQUEsYUFBNkIsQ0FDaENELFNBRGdDLEVBRWhDUCxlQUFlLENBQUNRLFVBQUQsQ0FGaUIsQ0FBN0I7QUFBQSxLQURBLEVBS0pDLE1BTEksQ0FLR3ZCLHVCQUxILEVBSzRCLEVBTDVCLENBQVA7QUFNRCxHQVBNLENBQVA7QUFRRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZXN1bHRMaXN0IGZyb20gXCIuL1Jlc3VsdExpc3RcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvUmVzdWx0TGlzdChyZXNwb25zZSkge1xuICBjb25zdCByZXN1bHRzID0gZ2V0UmVzdWx0cyhyZXNwb25zZS5oaXRzLmhpdHMpO1xuICBjb25zdCBpbmZvID0gZ2V0SW5mbyhyZXNwb25zZS5oaXRzKTtcbiAgcmV0dXJuIG5ldyBSZXN1bHRMaXN0KHJlc3VsdHMsIGluZm8pO1xufVxuXG5jb25zdCBhZGRFYWNoS2V5VmFsdWVUb09iamVjdCA9IChhY2MsIFtrZXksIHZhbHVlXSkgPT4gKHtcbiAgLi4uYWNjLFxuICBba2V5XTogdmFsdWVcbn0pO1xuXG5mdW5jdGlvbiBnZXRJbmZvKGhpdHMpIHtcbiAgcmV0dXJuIHtcbiAgICBtZXRhOiB7XG4gICAgICB3YXJuaW5nczogW10sIC8vIFRPRE9cbiAgICAgIHBhZ2U6IHtcbiAgICAgICAgY3VycmVudDogMSwgLy8gVE9ET1xuICAgICAgICB0b3RhbF9wYWdlczogMTAsXG4gICAgICAgIHNpemU6IDEwLFxuICAgICAgICB0b3RhbF9yZXN1bHRzOiBoaXRzLnRvdGFsXG4gICAgICB9LFxuICAgICAgcmVxdWVzdF9pZDogXCJcIiAvLyBUT0RPXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRSZXN1bHRzKHJlY29yZHMpIHtcbiAgY29uc3QgdG9PYmplY3RXaXRoUmF3ID0gdmFsdWUgPT4gKHsgcmF3OiB2YWx1ZSB9KTtcblxuICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMocmVjb3JkLl9zb3VyY2UpXG4gICAgICAubWFwKChbZmllbGROYW1lLCBmaWVsZFZhbHVlXSkgPT4gW1xuICAgICAgICBmaWVsZE5hbWUsXG4gICAgICAgIHRvT2JqZWN0V2l0aFJhdyhmaWVsZFZhbHVlKVxuICAgICAgXSlcbiAgICAgIC5yZWR1Y2UoYWRkRWFjaEtleVZhbHVlVG9PYmplY3QsIHt9KTtcbiAgfSk7XG59XG4iXX0=