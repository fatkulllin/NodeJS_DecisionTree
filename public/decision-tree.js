var dt = (function () {
          
    /**
     * Создает экземпляр дерева решений
     *
     * @constructor
     * @param builder - содержит тренировочный набор  and
     *                  некоторые параметры конфигурации
     */
    function DecisionTree(builder) {        
        this.root = buildDecisionTree({
            trainingSet: builder.trainingSet,
            ignoredAttributes: arrayToHashSet(builder.ignoredAttributes),
            categoryAttr: builder.categoryAttr || 'category',
            minItemsCount: builder.minItemsCount || 1,
            entropyThrehold: builder.entropyThrehold || 0.01,
            maxTreeDepth: builder.maxTreeDepth || 70
        });
    }
          
    DecisionTree.prototype.predict = function (item) {
        return predict(this.root, item);
    }

    /**
     * Создает экземпляр RandomForest
     * с указанным количеством деревьев
     *
     * @constructor
     * @param builder - содержит тренировочный набор и некоторые
     *                  параметры конфигурации для
     *                  деревья принятия решений
     */
    function RandomForest(builder, treesNumber) {
        this.trees = buildRandomForest(builder, treesNumber);
    }
          
    RandomForest.prototype.predict = function (item) {
        return predictRandomForest(this.trees, item);
    }
    
    /**
     * Преобразование массива в объект с такими атрибутами
     * как элементы массива (впоследствии его можно использовать как HashSet)
     */
    function arrayToHashSet(array) {
        var hashSet = {};
        if (array) {
            for(var i in array) {
                var attr = array[i];
                hashSet[attr] = true;
            }
        }
        return hashSet;
    }
    
    /**
     * Подсчет, сколько объектов имеют одинаковые
     * значения конкретного атрибута.
     *
     * @param items - массив объектов
     *
     * @param attr  - переменная с именем атрибута, 
     *                который встроен в каждый объект
     */
    function countUniqueValues(items, attr) {
        var counter = {};

        // обнаружение различных значений атрибута
        for (var i = items.length - 1; i >= 0; i--) {
            // items[i][attr] - значение атрибута
            counter[items[i][attr]] = 0;
        }
          
        // подсчет количества вхождений каждого из значений
        // атрибута
        for (var i = items.length - 1; i >= 0; i--) {
            counter[items[i][attr]] += 1;
        }

        return counter;
    }
    
    /**
     * Расчет энтропии массива объектов
     * по определенному признаку.
     *
     * @param items - массив объектов
     *
     * @param attr  - переменная с именем атрибута, 
     *                который встроен в каждый объект
     */
    function entropy(items, attr) {
        // подсчет количества вхождений каждого из значений
        // из атрибута
        var counter = countUniqueValues(items, attr);

        var entropy = 0;
        var p;
        for (var i in counter) {
            p = counter[i] / items.length;
            entropy += -p * Math.log(p);
        }

        return entropy;
    }
          
    /**
     * Разбиение массива объектов по значению конкретного атрибута,
     * используя определенный предикат и пивот.
     *
     * Элементы, которые соответствуют предикату, будут скопированы в
     * новый массив с именем 'match', а остальные элементы
     * будет скопирован в массив с именем notMatch
     *
     * @param items - array of objects массив объектов
     *
     * @param attr  - variable with name of attribute, переменная с именем атрибута,
     *                which embedded in each object который встроен в каждый объект
     *
     * @param predicate - function(x, y) 
     *                    which returns 'true' or 'false'
     *
     * @param pivot - used as the second argument when  используется в качестве второго аргумента, когда
     *                calling predicate function:
     *                e.g. predicate(item[attr], pivot)
     */
    function split(items, attr, predicate, pivot) {
        var match = [];
        var notMatch = [];

        var item,
            attrValue;
          
        for (var i = items.length - 1; i >= 0; i--) {
            item = items[i];
            attrValue = item[attr];

            if (predicate(attrValue, pivot)) {
                match.push(item);
            } else {
                notMatch.push(item);
            }
        };

        return {
            match: match,
            notMatch: notMatch
        };
    }

    /**
     * Finding value of specific attribute which is most frequent Нахождение значения конкретного атрибута, который чаще всего
     * in given array of objects. в данном массиве объектов.
     *
     * @param items - array of objects массив объектов
     *
     * @param attr  - variable with name of attribute, переменная с именем атрибута,
     *                which embedded in each object который встроен в каждый объект
     */
    function mostFrequentValue(items, attr) {
        // counting number of occurrences of each of values подсчет количества вхождений каждого из значений
        // of attribute атрибута
        var counter = countUniqueValues(items, attr);

        var mostFrequentCount = 0;
        var mostFrequentValue;

        for (var value in counter) {
            if (counter[value] > mostFrequentCount) {
                mostFrequentCount = counter[value];
                mostFrequentValue = value;
            }
        };

        return mostFrequentValue;
    }
          
    var predicates = {
        '==': function (a, b) { return a == b },
        '>=': function (a, b) { return a >= b }
    };

    /**
     * Function for building decision tree
     */
    function buildDecisionTree(builder) {

        var trainingSet = builder.trainingSet;
        var minItemsCount = builder.minItemsCount;
        var categoryAttr = builder.categoryAttr;
        var entropyThrehold = builder.entropyThrehold;
        var maxTreeDepth = builder.maxTreeDepth;
        var ignoredAttributes = builder.ignoredAttributes;

        if ((maxTreeDepth == 0) || (trainingSet.length <= minItemsCount)) {
            // restriction by maximal depth of tree ограничение по максимальной глубине дерева
            // or size of training set is to small или размер тренировочного набора мал
            // so we have to terminate process of building tree поэтому мы должны прекратить процесс построения дерева
            return {
                category: mostFrequentValue(trainingSet, categoryAttr)
            };
        }

        var initialEntropy = entropy(trainingSet, categoryAttr);

        if (initialEntropy <= entropyThrehold) {
            // entropy of training set too small слишком мала энтропия обучения
            // (it means that training set is almost homogeneous), (это означает, что тренировочный набор практически однороден),
            // so we have to terminate process of building tree поэтому мы должны прекратить процесс построения дерева
            return {
                category: mostFrequentValue(trainingSet, categoryAttr)
            };
        }

        // used as hash-set for avoiding the checking of split by rules 
        // используется как хэш-набор, чтобы избежать проверки разбиения по правилам
        // with the same 'attribute-predicate-pivot' more than once 
        //с одним и тем же атрибутом-предикатом-пивотом более одного раза
        var alreadyChecked = {};
          
        // this variable expected to contain rule, which splits training set 
        //// ожидается, что эта переменная будет содержать правило, которое разбивает тренировочный набор
        // into subsets with smaller values of entropy (produces informational gain)
        //на подмножества с меньшими значениями энтропии (дает информационный прирост)
        var bestSplit = {gain: 0};

        for (var i = trainingSet.length - 1; i >= 0; i--) {
            var item = trainingSet[i];

            // iterating over all attributes of item
            //перебирая все атрибуты элемента
            for (var attr in item) {
                if ((attr == categoryAttr) || ignoredAttributes[attr]) {
                    continue;
                }

                // let the value of current attribute be the pivot
                //пусть значение текущего атрибута будет стержнем
                var pivot = item[attr];

                // pick the predicate
                //выбрать предикат
                // depending on the type of the attribute value
                //в зависимости от типа значения атрибута
                var predicateName;
                if (typeof pivot == 'number') {
                    predicateName = '>=';
                } else {
                    // there is no sense to compare non-numeric attributes
                    //нет смысла сравнивать нечисловые атрибуты
                    // so we will check only equality of such attributes
                    //поэтому мы проверим только равенство таких атрибутов
                    predicateName = '==';
                }

                var attrPredPivot = attr + predicateName + pivot;
                if (alreadyChecked[attrPredPivot]) {
                    // skip such pairs of 'attribute-predicate-pivot',
                    //пропустить такие пары «атрибут-предикат-пивот»,
                    // which been already checked
                    //который уже проверен
                    continue;
                }
                alreadyChecked[attrPredPivot] = true;

                var predicate = predicates[predicateName];
          
                // splitting training set by given 'attribute-predicate-value'
                // разделение обучающего набора по заданному атрибуту-предикату-значению
                var currSplit = split(trainingSet, attr, predicate, pivot);

                // calculating entropy of subsets
                //вычисление энтропии подмножеств
                var matchEntropy = entropy(currSplit.match, categoryAttr);
                var notMatchEntropy = entropy(currSplit.notMatch, categoryAttr);

                // calculating informational gain
                // вычисление прироста информации
                var newEntropy = 0;
                newEntropy += matchEntropy * currSplit.match.length;
                newEntropy += notMatchEntropy * currSplit.notMatch.length;
                newEntropy /= trainingSet.length;
                var currGain = initialEntropy - newEntropy;

                if (currGain > bestSplit.gain) {
                    // remember pairs 'attribute-predicate-value'
                    // запоминаем пары «атрибут-предикат-значение»
                    // which provides informational gain
                    // который обеспечивает информационный прирост
                    bestSplit = currSplit;
                    bestSplit.predicateName = predicateName;
                    bestSplit.predicate = predicate;
                    bestSplit.attribute = attr;
                    bestSplit.pivot = pivot;
                    bestSplit.gain = currGain;
                }
            }
        }

        if (!bestSplit.gain) {
            // can't find optimal split
            //не могу найти оптимальное разделение
            return { category: mostFrequentValue(trainingSet, categoryAttr) };
        }

        // building subtrees
          //строительные поддеревья
        builder.maxTreeDepth = maxTreeDepth - 1;

        builder.trainingSet = bestSplit.match;
        var matchSubTree = buildDecisionTree(builder);

        builder.trainingSet = bestSplit.notMatch;
        var notMatchSubTree = buildDecisionTree(builder);

        return {
            attribute: bestSplit.attribute,
            predicate: bestSplit.predicate,
            predicateName: bestSplit.predicateName,
            pivot: bestSplit.pivot,
            match: matchSubTree,
            notMatch: notMatchSubTree,
            matchedCount: bestSplit.match.length,
            notMatchedCount: bestSplit.notMatch.length
        };
    }

    /**
     * Классификация товара с использованием дерева решений
     */
    function predict(tree, item) {
        var attr,
            value,
            predicate,
            pivot;
        
        // Traversing tree from the root to leaf
        //Обход дерева от корня до листа
        while(true) {
          
            if (tree.category) {
                // only leafs contains predicted category
                //только листья содержат прогнозируемую категорию
                return tree.category;
            }

            attr = tree.attribute;
            value = item[attr];

            predicate = tree.predicate;
            pivot = tree.pivot;

            // move to one of subtrees
            // перейти к одному из поддеревьев
            if (predicate(value, pivot)) {
                tree = tree.match;
            } else {
                tree = tree.notMatch;
            }
        }
    }

    /**
     * Building array of decision trees
     * //Построение массива деревьев решений
     */
    function buildRandomForest(builder, treesNumber) {
        var items = builder.trainingSet;
          
        // creating training sets for each tree
        //создание учебных наборов для каждого дерева
        var trainingSets = [];
        for (var t = 0; t < treesNumber; t++) {
            trainingSets[t] = [];
        }
        for (var i = items.length - 1; i >= 0 ; i--) {
          // assigning items to training sets of each tree
          //назначение предметов на тренировочные наборы каждого дерева
          // using 'round-robin' strategy
          //используя «круговую» стратегию
          var correspondingTree = i % treesNumber;
          trainingSets[correspondingTree].push(items[i]);
        }

        // building decision trees
        // построение деревьев решений
        var forest = [];
        for (var t = 0; t < treesNumber; t++) {
            builder.trainingSet = trainingSets[t];

            var tree = new DecisionTree(builder);
            forest.push(tree);
        }
        return forest;
    }

    /**
     * Each of decision tree classifying item
     * //Каждый из дерева решений классифицирует элемент
     * ('voting' that item corresponds to some class).
     * //(«Голосование», что пункт соответствует некоторому классу).
     *
     * This function returns hash, which contains 
     * Эта функция возвращает хеш, который содержит
     * all classifying results, and number of votes 
     * все результаты классификации и количество голосов
     * which were given for each of classifying results
     * которые были даны для каждого из результатов классификации
     */
    function predictRandomForest(forest, item) {
        var result = {};
        for (var i in forest) {
            var tree = forest[i];
            var prediction = tree.predict(item);
            result[prediction] = result[prediction] ? result[prediction] + 1 : 1;
        }
        return result;
    }

    var exports = {};
    exports.DecisionTree = DecisionTree;
    exports.RandomForest = RandomForest;
    return exports;
})();