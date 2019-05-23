function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import ResultList from "./ResultList";
export function toResultList(response) {
  var results = getResults(response.hits.hits);
  var info = getInfo(response.hits);
  return new ResultList(results, info);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXNwb25zZUFkYXB0ZXJzLmpzIl0sIm5hbWVzIjpbIlJlc3VsdExpc3QiLCJ0b1Jlc3VsdExpc3QiLCJyZXNwb25zZSIsInJlc3VsdHMiLCJnZXRSZXN1bHRzIiwiaGl0cyIsImluZm8iLCJnZXRJbmZvIiwiYWRkRWFjaEtleVZhbHVlVG9PYmplY3QiLCJhY2MiLCJrZXkiLCJ2YWx1ZSIsIm1ldGEiLCJ3YXJuaW5ncyIsInBhZ2UiLCJjdXJyZW50IiwidG90YWxfcGFnZXMiLCJzaXplIiwidG90YWxfcmVzdWx0cyIsInRvdGFsIiwicmVxdWVzdF9pZCIsInJlY29yZHMiLCJ0b09iamVjdFdpdGhSYXciLCJyYXciLCJtYXAiLCJyZWNvcmQiLCJPYmplY3QiLCJlbnRyaWVzIiwiX3NvdXJjZSIsImZpZWxkTmFtZSIsImZpZWxkVmFsdWUiLCJyZWR1Y2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE9BQU9BLFVBQVAsTUFBdUIsY0FBdkI7QUFFQSxPQUFPLFNBQVNDLFlBQVQsQ0FBc0JDLFFBQXRCLEVBQWdDO0FBQ3JDLE1BQU1DLE9BQU8sR0FBR0MsVUFBVSxDQUFDRixRQUFRLENBQUNHLElBQVQsQ0FBY0EsSUFBZixDQUExQjtBQUNBLE1BQU1DLElBQUksR0FBR0MsT0FBTyxDQUFDTCxRQUFRLENBQUNHLElBQVYsQ0FBcEI7QUFDQSxTQUFPLElBQUlMLFVBQUosQ0FBZUcsT0FBZixFQUF3QkcsSUFBeEIsQ0FBUDtBQUNEOztBQUVELElBQU1FLHVCQUF1QixHQUFHLFNBQTFCQSx1QkFBMEIsQ0FBQ0MsR0FBRDtBQUFBO0FBQUEsTUFBT0MsR0FBUDtBQUFBLE1BQVlDLEtBQVo7O0FBQUEsMkJBQzNCRixHQUQyQixzQkFFN0JDLEdBRjZCLEVBRXZCQyxLQUZ1QjtBQUFBLENBQWhDOztBQUtBLFNBQVNKLE9BQVQsQ0FBaUJGLElBQWpCLEVBQXVCO0FBQ3JCLFNBQU87QUFDTE8sSUFBQUEsSUFBSSxFQUFFO0FBQ0pDLE1BQUFBLFFBQVEsRUFBRSxFQUROO0FBQ1U7QUFDZEMsTUFBQUEsSUFBSSxFQUFFO0FBQ0pDLFFBQUFBLE9BQU8sRUFBRSxDQURMO0FBQ1E7QUFDWkMsUUFBQUEsV0FBVyxFQUFFLEVBRlQ7QUFHSkMsUUFBQUEsSUFBSSxFQUFFLEVBSEY7QUFJSkMsUUFBQUEsYUFBYSxFQUFFYixJQUFJLENBQUNjO0FBSmhCLE9BRkY7QUFRSkMsTUFBQUEsVUFBVSxFQUFFLEVBUlIsQ0FRVzs7QUFSWDtBQURELEdBQVA7QUFZRDs7QUFFRCxTQUFTaEIsVUFBVCxDQUFvQmlCLE9BQXBCLEVBQTZCO0FBQzNCLE1BQU1DLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsQ0FBQVgsS0FBSztBQUFBLFdBQUs7QUFBRVksTUFBQUEsR0FBRyxFQUFFWjtBQUFQLEtBQUw7QUFBQSxHQUE3Qjs7QUFFQSxTQUFPVSxPQUFPLENBQUNHLEdBQVIsQ0FBWSxVQUFBQyxNQUFNLEVBQUk7QUFDM0IsV0FBT0MsTUFBTSxDQUFDQyxPQUFQLENBQWVGLE1BQU0sQ0FBQ0csT0FBdEIsRUFDSkosR0FESSxDQUNBO0FBQUE7QUFBQSxVQUFFSyxTQUFGO0FBQUEsVUFBYUMsVUFBYjs7QUFBQSxhQUE2QixDQUNoQ0QsU0FEZ0MsRUFFaENQLGVBQWUsQ0FBQ1EsVUFBRCxDQUZpQixDQUE3QjtBQUFBLEtBREEsRUFLSkMsTUFMSSxDQUtHdkIsdUJBTEgsRUFLNEIsRUFMNUIsQ0FBUDtBQU1ELEdBUE0sQ0FBUDtBQVFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc3VsdExpc3QgZnJvbSBcIi4vUmVzdWx0TGlzdFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9SZXN1bHRMaXN0KHJlc3BvbnNlKSB7XG4gIGNvbnN0IHJlc3VsdHMgPSBnZXRSZXN1bHRzKHJlc3BvbnNlLmhpdHMuaGl0cyk7XG4gIGNvbnN0IGluZm8gPSBnZXRJbmZvKHJlc3BvbnNlLmhpdHMpO1xuICByZXR1cm4gbmV3IFJlc3VsdExpc3QocmVzdWx0cywgaW5mbyk7XG59XG5cbmNvbnN0IGFkZEVhY2hLZXlWYWx1ZVRvT2JqZWN0ID0gKGFjYywgW2tleSwgdmFsdWVdKSA9PiAoe1xuICAuLi5hY2MsXG4gIFtrZXldOiB2YWx1ZVxufSk7XG5cbmZ1bmN0aW9uIGdldEluZm8oaGl0cykge1xuICByZXR1cm4ge1xuICAgIG1ldGE6IHtcbiAgICAgIHdhcm5pbmdzOiBbXSwgLy8gVE9ET1xuICAgICAgcGFnZToge1xuICAgICAgICBjdXJyZW50OiAxLCAvLyBUT0RPXG4gICAgICAgIHRvdGFsX3BhZ2VzOiAxMCxcbiAgICAgICAgc2l6ZTogMTAsXG4gICAgICAgIHRvdGFsX3Jlc3VsdHM6IGhpdHMudG90YWxcbiAgICAgIH0sXG4gICAgICByZXF1ZXN0X2lkOiBcIlwiIC8vIFRPRE9cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFJlc3VsdHMocmVjb3Jkcykge1xuICBjb25zdCB0b09iamVjdFdpdGhSYXcgPSB2YWx1ZSA9PiAoeyByYXc6IHZhbHVlIH0pO1xuXG4gIHJldHVybiByZWNvcmRzLm1hcChyZWNvcmQgPT4ge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhyZWNvcmQuX3NvdXJjZSlcbiAgICAgIC5tYXAoKFtmaWVsZE5hbWUsIGZpZWxkVmFsdWVdKSA9PiBbXG4gICAgICAgIGZpZWxkTmFtZSxcbiAgICAgICAgdG9PYmplY3RXaXRoUmF3KGZpZWxkVmFsdWUpXG4gICAgICBdKVxuICAgICAgLnJlZHVjZShhZGRFYWNoS2V5VmFsdWVUb09iamVjdCwge30pO1xuICB9KTtcbn1cbiJdfQ==